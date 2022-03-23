package net.createyourideas.app.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.serviceregistry.Registration;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, net.createyourideas.app.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, net.createyourideas.app.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, net.createyourideas.app.domain.User.class.getName());
            createCache(cm, net.createyourideas.app.domain.Authority.class.getName());
            createCache(cm, net.createyourideas.app.domain.User.class.getName() + ".authorities");
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName());
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".incomes");
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".outgoings");
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".worksheets");
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".parents");
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".balances");
            createCache(cm, net.createyourideas.app.domain.Income.class.getName());
            createCache(cm, net.createyourideas.app.domain.Outgoings.class.getName());
            createCache(cm, net.createyourideas.app.domain.Balance.class.getName());
            createCache(cm, net.createyourideas.app.domain.Worksheet.class.getName());
            createCache(cm, net.createyourideas.app.domain.Feedback.class.getName());
            createCache(cm, net.createyourideas.app.domain.ProfitBalance.class.getName());
            createCache(cm, net.createyourideas.app.domain.Share.class.getName());
            createCache(cm, net.createyourideas.app.domain.Point.class.getName());
            createCache(cm, net.createyourideas.app.domain.UserPointAssociation.class.getName());
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".donations");
            createCache(cm, net.createyourideas.app.domain.Donation.class.getName());
            createCache(cm, net.createyourideas.app.domain.IdeaTransactionId.class.getName());
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".txIds");
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".employees");
            createCache(cm, net.createyourideas.app.domain.Application.class.getName());
            createCache(cm, net.createyourideas.app.domain.Employee.class.getName());
            createCache(cm, net.createyourideas.app.domain.Employee.class.getName() + ".employees");
            createCache(cm, net.createyourideas.app.domain.Employee.class.getName() + ".ideas");
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".applications");
            createCache(cm, net.createyourideas.app.domain.Application.class.getName() + ".users");
            createCache(cm, net.createyourideas.app.domain.Worksheet.class.getName() + ".employees");
            createCache(cm, net.createyourideas.app.domain.Employee.class.getName() + ".worksheets");
            createCache(cm, net.createyourideas.app.domain.MonthlyIncomeInvoice.class.getName());
            createCache(cm, net.createyourideas.app.domain.MonthlyOutgoingsInvoice.class.getName());
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".monthlyIncomeInvoices");
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".monthlyOutgoingsInvoices");
            createCache(cm, net.createyourideas.app.domain.IdeaComment.class.getName());
            createCache(cm, net.createyourideas.app.domain.IdeaLikeDislike.class.getName());
            createCache(cm, net.createyourideas.app.domain.IdeaStarRating.class.getName());
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".ideaStarRatings");
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".ideaComments");
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".ideaLikeDislikes");
            createCache(cm, net.createyourideas.app.domain.IdeaComment.class.getName() + ".ideaComments");
            createCache(cm, net.createyourideas.app.domain.Income.class.getName() + ".incomeIdeas");
            createCache(cm, net.createyourideas.app.domain.Outgoings.class.getName() + ".outgoingIdeas");
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".ideaIncomes");
            createCache(cm, net.createyourideas.app.domain.Idea.class.getName() + ".ideaOutgoings");
            createCache(cm, net.createyourideas.app.domain.Properties.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
